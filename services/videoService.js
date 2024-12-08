const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const Video = require("../models/VideoModel");
const Theme = require("../models/ThemeModel");




exports.createVideo = asyncHandler(async (req, res) => {
  try {
    const { title, videoUrl, uploaderId, themes, imageUrl, reference } =
      req.body;

    // التحقق من آخر فيديو للمستخدم
    const lastVideo = await Video.findOne({
      where: { uploaderId },
      order: [["createdAt", "DESC"]], // للحصول على أحدث فيديو
    });

    if (lastVideo && !lastVideo.isValid) {
      return res.status(400).json({
        message: "Cannot add a new video until the last one is validated.",
      });
    }

    // إنشاء فيديو جديد
    const newVideo = await Video.create({
      title,
      videoUrl,
      uploaderId,
      imageUrl,
      reference,
    });

    // ربط الفيديو بالـ themes (افتراض أن themes هو مصفوفة من IDs)
    if (themes && Array.isArray(themes) && themes.length > 0) {
      await newVideo.setThemes(themes); // ضبط العلاقة
    }

    // جلب الفيديو مع العلاقات المرتبطة لتضمينها في الاستجابة
    const videoWithRelations = await Video.findByPk(newVideo.id, {
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        { model: Theme, as: "themes", attributes: ["id", "name"] },
      ],
    });

    res.status(201).json({
      message: "Video created successfully",
      video: videoWithRelations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




exports.validateVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {status} = req.body;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.isValid = true;
    video.status = status
    await video.save();
    res.status(200).json({ message: "Video validated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


exports.getAllVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosIsValidByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // id الخاص بالموضوع (theme)

    const videos = await Video.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة من Theme
          through: { attributes: [] }, // لإخفاء بيانات الجدول الوسيط
          where: { id }, // شرط لتصفية النتائج بناءً على معرف الموضوع
        },
      ],
      where: { isValid: true }, // شرط أن يكون الفيديو صالحًا
    });

    res.status(200).json({
      message: "Videos found successfully",
      result: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosNotValidByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
          where: { id },
        },
      ],
      where: { isValid: false },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getVideosByUploader = asyncHandler(async (req, res) => {
  
  try {
    const { id } = req.params;
    const videos = await Video.findAll({
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          through: { attributes: [] },
        },
      ],
      where: { uploaderId: id },
    });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



exports.addThemesToVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId, themes } = req.body;

    // التحقق من أن المواضيع مصفوفة ولا تتجاوز 3 عناصر
    if (!Array.isArray(themes) || themes.length > 3) {
      return res.status(400).json({
        message: "A video can have up to 3 themes only.",
      });
    }

    // التحقق من وجود الفيديو
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // التحقق من المواضيع المرتبطة حاليًا
    const currentThemes = await video.getThemes();
    if (currentThemes.length + themes.length > 3) {
      return res.status(400).json({
        message: `Adding these themes will exceed the maximum of 3 themes per video. Current themes: ${currentThemes.length}.`,
      });
    }

    // إضافة المواضيع الجديدة
    await video.addThemes(themes);

    // استرجاع الفيديو مع المواضيع
    const updatedVideo = await Video.findByPk(videoId, {
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      message: "Themes added successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updateThemesForVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId, themes } = req.body;

    // التحقق من أن المواضيع مصفوفة ولا تتجاوز 3 عناصر
    if (!Array.isArray(themes) || themes.length > 3) {
      return res.status(400).json({
        message: "A video can have up to 3 themes only.",
      });
    }

    // التحقق من وجود الفيديو
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // استبدال المواضيع الحالية بالمواضيع الجديدة
    await video.setThemes(themes);

    // استرجاع الفيديو مع المواضيع الجديدة
    const updatedVideo = await Video.findByPk(videoId, {
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      message: "Themes updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.removeThemeFromVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId, themeId } = req.body;

    // التحقق من وجود الفيديو
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // إزالة الموضوع المرتبط بالفيديو
    await video.removeTheme(themeId);

    // استرجاع الفيديو مع المواضيع المحدثة
    const updatedVideo = await Video.findByPk(videoId, {
      include: [
       { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      message: "Theme removed successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



exports.getVideoById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const video = await Video.findByPk(id, {
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة من Theme
          through: { attributes: [] }, // لإخفاء الجدول الوسيط
        },
      ],
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



exports.updateVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // معرف الفيديو
    const { themes, ...videoData } = req.body; // فصل المواضيع (themes) عن باقي البيانات

    // التحقق من وجود الفيديو
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // تحديث بيانات الفيديو
    await video.update(videoData);

    // تحديث العلاقات المرتبطة مع المواضيع (themes)
    if (themes && Array.isArray(themes)) {
      await video.setThemes(themes); // تعيين المواضيع الجديدة
    }

    // جلب الفيديو بعد التحديث مع العلاقات المرتبطة
    const updatedVideo = await Video.findByPk(id, {
      include: [
        { model: User, as: "uploader", attributes: ["id", "username"] },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.destroy({ where: { id } });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.addLikes = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.likes += 1;
    await video.save();
    res.status(200).json({ message: "Likes added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.removeLikes = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.likes -= 1;
    await video.save();
    res.status(200).json({ message: "Likes removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.getVideosByTheme = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // id الخاص بـ Theme
    const videos = await Video.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "username"], // الحقول المطلوبة فقط من User
        },
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "name", "createdAt", "updatedAt"], // الحقول المطلوبة فقط من Theme
          through: { attributes: [] }, // لإخفاء الجدول الوسيط
          where: { id }, // الشرط هنا للبحث بناءً على معرف Theme
        },
      ],
    });

    res.status(200).json({
      message: "Videos found successfully",
      result: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
